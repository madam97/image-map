import React, { useEffect, useReducer, useState } from 'react';
import { getId, getClass } from './functions';
import Circle from './shapes/Circle';
import Rect from './shapes/Rect';
import { initState as activeShapeInitState, reducer as activeShapeReducer, EAction as EActiveShapeAction } from './reducers/ActiveShapeReducer';
import { initState as activeDotInitState, reducer as activeDotReducer, EAction as EActiveDotAction } from './reducers/ActiveDot';
import { reducer as shapesReducer, EAction as EShapesAction } from './reducers/ShapesReducer';
import { reducer as dotsReducer, EAction as EDotsAction } from './reducers/DotsReducer';
import '../../scss/components/SVGEditor.scss';
import { IObject } from '../../interfaces/MainInterfaces';
import Poly from './shapes/Poly';

type SVGEditorProps = {
  width?: number,
  height?: number
};

export default function SVGEditor({ width, height }: SVGEditorProps): JSX.Element {

  const [activeShape, dispatchActiveShape] = useReducer(activeShapeReducer, activeShapeInitState);
  const [activeDot, dispatchActiveDot] = useReducer(activeDotReducer, activeDotInitState);
  const [shapes, dispatchShapes] = useReducer(shapesReducer, []);
  const [dots, dispatchDots] = useReducer(dotsReducer, []);

  /**
   * Add, change or remove the active shape using the dots
   */
  useEffect(() => {
    switch (activeShape.type) {
      case 'rect':
        if (dots.length === 2) {
          const x = Math.min(dots[0].x, dots[1].x);
          const y = Math.min(dots[0].y, dots[1].y);
          const width = Math.max(dots[0].x, dots[1].x) - x;
          const height = Math.max(dots[0].y, dots[1].y) - y;

          setShape({ x, y, width, height });
        } else {
          removeActiveShape();
        }
        break;
      case 'circle':
        if (dots.length === 2) {
          const x = dots[0].x;
          const y = dots[0].y;
          const r = Math.sqrt( Math.pow(Math.abs(dots[0].x - dots[1].x), 2) + Math.pow(Math.abs(dots[0].y - dots[1].y), 2) );

          setShape({ x, y, r });
        } else {
          removeActiveShape();
        }
        break;
      case 'poly':
        if (dots.length > 1) {
          setShape({ points: dots });
        } else {
          removeActiveShape();
        }
        break;
    }
  }, [dots]);

  /**
   * Adds a new dot to the canvas
   * @param event 
   */
  const handleCanvasClick = (event: React.MouseEvent<SVGElement>): void => {
    if (activeDot.index === null) {
      const { top, left } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      switch (activeShape.type) {
        case 'rect':
        case 'circle':
          if (dots.length < 2) {
            dispatchDots({ type: EDotsAction.ADD, payload: {x,y} });
          }
          break;
        case 'poly':
          dispatchDots({ type: EDotsAction.ADD, payload: {x,y} });
          break;
      }
    }
  }

  /**
   * Moves the active dot on the canvas
   * @param event 
   */
  const handleCanvasMouseMove = (event: React.MouseEvent<SVGElement>): void => {
    if (activeDot.index !== null) {
      const { top, left } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      dispatchDots({ type: EDotsAction.CHANGE, index: activeDot.index, payload: {x,y} });
      dispatchActiveDot({ type: EActiveDotAction.MOVE });
    }
  }



  /// SHAPE METHODS

  /**
   * Adds or changes a shape on the canvas
   * @param shape 
   */
  const setShape = (shape: IObject): void => {
    shape = {
      ...shape,
      type: activeShape.type,
      dots
    }

    if (activeShape.index !== null) {
      dispatchShapes({ type: EShapesAction.CHANGE, index: activeShape.index, payload: shape });
    } else {
      dispatchActiveShape({ type: EActiveShapeAction.CHOOSE, payload: shapes.length });
      dispatchShapes({ type: EShapesAction.ADD, payload: shape });
    }
  }

  /**
   * Selects a shape, sets it to be the active shape and shows its dots
   */
  const selectActiveShape = (event: React.MouseEvent<SVGRectElement | SVGCircleElement | SVGPolygonElement>): void => {
    event.stopPropagation();

    const index = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));

    if (!event.currentTarget.classList.contains('active') && shapes[index]) {
      console.log(index, shapes[index]);

      dispatchActiveShape({ type: EActiveShapeAction.SET, payload: { index, type: shapes[index].type } });
      dispatchDots({ type: EDotsAction.SET, payload: shapes[index].dots });
    }
  }

  /**
   * Sets the editor to add a new element
   */
  const addNewActiveShape = (): void => {
    dispatchActiveShape({ type: EActiveShapeAction.CHOOSE, payload: null });
    dispatchDots({ type: EDotsAction.EMPTY });
  }

  /**
   * Removes the active shape from the canvas
   * @params removeDots
   */
  const removeActiveShape = (removeDots: boolean = false): void => {
    if (activeShape.index !== null) {
      dispatchShapes({ type: EShapesAction.REMOVE, index: activeShape.index });
    }
    dispatchActiveShape({ type: EActiveShapeAction.CHOOSE, payload: null });

    if (removeDots) {
      dispatchDots({ type: EDotsAction.EMPTY });
    }
  }

  /**
   * Sets the active shape type and removes the active shape if it is not ready
   * @param type
   */
  const setActiveShapeType = (type: string): void => {
    if (activeShape.index !== null) {
      removeActiveShape(true);
    }
    dispatchActiveShape({ type: EActiveShapeAction.SET_TYPE, payload: type });
  }

  /**
   * Draws the given shape
   * @param index
   * @param shape 
   */
  const drawShape = (index: number, shape: IObject): JSX.Element | void => {
    const id = getId(`${shape.type}-${index}`);

    const props = {
      id: id,
      className: `shape ${activeShape.index === index ? 'active' : ''}`,
      handleClick: selectActiveShape
    };
      
    switch (shape.type) {
      case 'rect':
        return (
          <Rect 
            key={id} 
            {...{
              ...props,
              x: shape.x,
              y: shape.y,
              width: shape.width,
              height: shape.height
            }}
          />
        );
      case 'circle':
        return (
          <Circle 
            key={id} 
            {...{
              ...props,
              x: shape.x,
              y: shape.y,
              r: shape.r
            }}
          />
        );
      case 'poly':
        return (
          <Poly 
            key={id} 
            {...{
              ...props,
              points: shape.dots
            }}
          />
        );
    }
  }


  /// DOT METHOD

  /**
   * Selects the active dot on the canvas
   * @param event 
   */
  const handleDotMouseDown = (event: React.MouseEvent<SVGCircleElement>): void => {
    event.stopPropagation();

    const index = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));
    dispatchActiveDot({ type: EActiveDotAction.CHOOSE, payload: index });
  }

  /**
   * Deselects the active dot on the canvas
   * @param event 
   */
  const handleDotMouseUp = (event: React.MouseEvent<SVGCircleElement>): void => {
    event.stopPropagation();

    const index = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));
    console.log('ACTIVE DOT END', activeDot.index);

    if (activeDot.index !== null && index === activeDot.index) {
      if (!activeDot.moved) {
        dispatchDots({ type: EDotsAction.REMOVE, index: activeDot.index });
      }
      dispatchActiveDot({ type: EActiveDotAction.INIT });
    }
  }



  // -----------------------------------------------------------

  const drawnDots = dots.map((dot,index): JSX.Element => {
    const id = getId(`dot-${index}`);

    const props = {
      id: id,
      className: 'dot',
      x: dot.x,
      y: dot.y,
      r: 3,
      handleMouseDown: handleDotMouseDown,
      handleMouseUp: handleDotMouseUp
    };

    return (<Circle key={id} {...props} />);
  });

  const drawnShapes = shapes.map((shape, index): JSX.Element | void => {
    if (activeShape.index !== index) {
      return drawShape(index, shape);
    }
  });
  if (activeShape.index !== null && shapes[activeShape.index]) {
    drawnShapes.push( drawShape(activeShape.index, shapes[activeShape.index]) );
  }

  return (
    <>
      <div>
        <button onClick={event => { event.preventDefault(); addNewActiveShape();}}>Add new</button>
        {activeShape.index !== null && <button onClick={event => { event.preventDefault(); removeActiveShape(true);}}>Remove selected</button>}

        <select value={activeShape.type} onChange={event => { event.preventDefault(); setActiveShapeType(event.currentTarget.value);}}>
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="poly">Polygon</option>
        </select>
      </div>

      <svg
        className={getClass('canvas')}
        width={width}
        height={height}
        onClick={event => handleCanvasClick(event)}
        onMouseMove={event => handleCanvasMouseMove(event)}
      >
        {drawnShapes}
        {drawnDots}
      </svg>
    </>
  );
};