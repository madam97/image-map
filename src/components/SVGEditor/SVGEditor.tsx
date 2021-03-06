import React, { useEffect, useReducer, useState } from 'react';
import { getId, getClass } from './functions';
import Circle from './shapes/Circle';
import Rect from './shapes/Rect';
import { initState as activeShapeInitState, reducer as activeShapeReducer, EAction as ActiveShapeAction } from './reducers/ActiveShape';
import { initState as activeDotInitState, reducer as activeDotReducer, EAction as ActiveDotAction } from './reducers/ActiveDot';
import { initState as shapesInitState, reducer as shapesReducer, EAction as ShapesAction } from './reducers/Shapes';
import { initState as dotsInitState, reducer as dotsReducer, EAction as DotsAction } from './reducers/Dots';
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
  const [shapes, dispatchShapes] = useReducer(shapesReducer, shapesInitState);
  const [dots, dispatchDots] = useReducer(dotsReducer, dotsInitState);

  /**
   * Add, change or remove the active shape using the dots
   */
  useEffect(() => {
    switch (activeShape.type) {
      case 'rect':
      case 'circle':
        const dot1 = dots.getIndex(0);
        const dot2 = dots.getIndex(1);
        if (dot1 && dot2) {
          let props: IObject;
          if (activeShape.type === 'rect') {
            const x = Math.min(dot1.x, dot2.x);
            const y = Math.min(dot1.y, dot2.y);
            const width = Math.max(dot1.x, dot2.x) - x;
            const height = Math.max(dot1.y, dot2.y) - y;
  
            props = { x, y, width, height };
          } else {
            const x = dot1.x;
            const y = dot1.y;
            const r = Math.sqrt( Math.pow(Math.abs(dot1.x - dot2.x), 2) + Math.pow(Math.abs(dot1.y - dot2.y), 2) );
  
            props = { x, y, r };
          }

          setShape(props);
        } else {
          removeActiveShape();
        }
        break;
      case 'poly':
        if (dots.size > 1) {
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
    if (activeDot.key === null) {
      const { top, left } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      switch (activeShape.type) {
        case 'rect':
        case 'circle':
          if (dots.size < 2) {
            dispatchDots({ type: DotsAction.ADD, payload: {dot: {x,y}} });
          }
          break;
        case 'poly':
          dispatchDots({ type: DotsAction.ADD, payload: {dot: {x,y}} });
          break;
      }
    }
  }

  /**
   * Moves the active dot on the canvas
   * @param event 
   */
  const handleCanvasMouseMove = (event: React.MouseEvent<SVGElement>): void => {
    if (activeDot.key !== null) {
      const { top, left } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      dispatchDots({ type: DotsAction.CHANGE, payload: {key: activeDot.key, dot: {x,y}} });
      dispatchActiveDot({ type: ActiveDotAction.MOVE });
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

    if (activeShape.key !== null) {
      dispatchShapes({ type: ShapesAction.CHANGE, payload: {key: activeShape.key, shape} });
    } else {
      dispatchShapes({ type: ShapesAction.ADD, payload: {shape} });
      dispatchActiveShape({ type: ActiveShapeAction.SELECT, payload: {key: shapes.keyNext()} });
    }
  }

  /**
   * Selects a shape, sets it to be the active shape and shows its dots
   */
  const selectActiveShape = (event: React.MouseEvent<SVGRectElement | SVGCircleElement | SVGPolygonElement>): void => {
    if (activeShape.key === null) {
      event.stopPropagation();

      const shapeKey = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));
      const shape = shapes.get(shapeKey);
  
      if (!event.currentTarget.classList.contains('active') && shape) {
        dispatchActiveShape({ type: ActiveShapeAction.SET, payload: { key: shapeKey, type: shape.type } });
        dispatchDots({ type: DotsAction.SET, payload: {dots: shape.dots} });
      }
    }
  }

  /**
   * Deselects the active shape and hides its dots
   */
  const deselectActiveShape = (event: React.MouseEvent<SVGElement>): void => {
    event.preventDefault();

    if (activeShape.key !== null) {
      dispatchActiveShape({ type: ActiveShapeAction.DESELECT });
      dispatchDots({ type: DotsAction.EMPTY });
    }
  }

  /**
   * Add a new element of the given type, removes the dots if there are no active shape
   * @param type
   */
  const addNewActiveShape = (type: string): void => {
    dispatchActiveShape({ type: ActiveShapeAction.SET, payload: { key: null, type } });
    dispatchDots({ type: DotsAction.EMPTY });
  }

  /**
   * Removes the active shape from the canvas
   * @params removeDots
   */
  const removeActiveShape = (removeDots: boolean = false): void => {
    if (activeShape.key !== null) {
      dispatchShapes({ type: ShapesAction.REMOVE, payload: {key: activeShape.key} });
      dispatchActiveShape({ type: ActiveShapeAction.DESELECT });
    }

    if (removeDots) {
      dispatchDots({ type: DotsAction.EMPTY });
    }
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
      className: `shape ${activeShape.key === index ? 'active cursor-default' : (activeShape.key !== null ? 'cursor-default' : '')}`,
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
  const selectActiveDot = (event: React.MouseEvent<SVGCircleElement>): void => {
    event.stopPropagation();

    const dotKey = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));
    dispatchActiveDot({ type: ActiveDotAction.SELECT, payload: {key: dotKey} });
  }

  /**
   * Deselects the active dot on the canvas
   * @param event 
   */
  const deselectActiveDot = (event: React.MouseEvent<SVGCircleElement>): void => {
    event.stopPropagation();

    const dotKey = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));

    if (activeDot.key !== null && dotKey === activeDot.key) {
      dispatchActiveDot({ type: ActiveDotAction.DESELECT });
    }
  }

  /**
   * Removes the given dot, deselects it if it is the active dot
   * @param event 
   */
  const removeDot = (event: React.MouseEvent<SVGCircleElement>): void => {
    event.preventDefault();
    event.stopPropagation(); 

    const dotKey = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));

    dispatchDots({ type: DotsAction.REMOVE, payload: {key: dotKey} });

    if (dotKey === activeDot.key) {
      dispatchActiveDot({ type: ActiveDotAction.DESELECT });
    }
  }



  // -----------------------------------------------------------

  const drawnDots = dots.map((dot,key) => {
    const id = getId(`dot-${key}`);

    const props = {
      id: id,
      className: 'dot',
      x: dot.x,
      y: dot.y,
      r: 3,
      handleClick: deselectActiveDot,
      handleContextMenu: removeDot,
      handleMouseDown: selectActiveDot
    };

    return (<Circle key={id} {...props} />);
  });

  const drawnShapes = shapes.map((shape, index): JSX.Element | void => {
    if (activeShape.key !== index) {
      return drawShape(index, shape);
    }
  });
  if (activeShape.key !== null) {
    const shape = shapes.get(activeShape.key);
    if (shape !== undefined) {
      drawnShapes.push( drawShape(activeShape.key, shape) );
    }
  }

  return (
    <>
      <svg
        className={getClass('canvas')}
        width={width}
        height={height}
        onClick={event => handleCanvasClick(event)}
        onMouseMove={event => handleCanvasMouseMove(event)}
        onContextMenu={event => deselectActiveShape(event)}
      >
        {drawnShapes}
        {drawnDots}
      </svg>

      <div>
        <select value={activeShape.type} onChange={event => { event.preventDefault(); addNewActiveShape(event.currentTarget.value);}}>
          <option value="" disabled>Shape type</option>
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="poly">Polygon</option>
        </select>

        {activeShape.key !== null && <button onClick={event => { event.preventDefault(); removeActiveShape(true);}}>Remove selected</button>}
      </div>
    </>
  );
};