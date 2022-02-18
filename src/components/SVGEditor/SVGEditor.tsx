import React, { useEffect, useReducer, useState } from 'react';
import { getId, getClass } from './functions';
import Circle from './shapes/Circle';
import Rect from './shapes/Rect';
import { initState as activeShapeInitState, reducer as activeShapeReducer, EAction as EActiveShapeAction } from './reducers/ActiveShapeReducer';
import { initState as activeDotInitState, reducer as activeDotReducer, EAction as EActiveDotAction } from './reducers/ActiveDot';
import { reducer as shapesReducer, EAction as EShapesAction } from './reducers/ShapesReducer';
import '../../scss/components/SVGEditor.scss';
import { IObject } from '../../interfaces/MainInterfaces';

type TActiveDot = {
  index: number | null,
  moved: boolean
};

type TCoord = {
  x: number,
  y: number
};



/// MAIN COMPONENT

type SVGEditorProps = {
  width?: number,
  height?: number
};

export default function SVGEditor({ width, height }: SVGEditorProps): JSX.Element {

  const [activeShape, dispatchActiveShape] = useReducer(activeShapeReducer, activeShapeInitState);
  const [activeDot, dispatchActiveDot] = useReducer(activeDotReducer, activeDotInitState);
  const [shapes, dispatchShapes] = useReducer(shapesReducer, []);
  const [dots, setDots] = useState<TCoord[]>([]);

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

          addOrChangeShape({ type: 'rect', x, y, width, height });
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
    const { top, left } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    switch (activeShape.type) {
      case 'rect':
        if (dots.length < 2) {
          addDot(x, y);
        }
        break;
    }
  }

  /**
   * Moves the active dot on the canvas
   * @param event 
   */
  const handleCanvasMouseMove = (event: React.MouseEvent<SVGElement>): void => {
    if (activeDot.index !== null) {
      console.log('ACTIVE DOT MOVE', activeDot);
      const { top, left } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      moveActiveDot(x, y);
    }
  }

  /**
   * Adds or changes a shape on the canvas
   * @param shape 
   */
  const addOrChangeShape = (shape: IObject): void => {
    if (activeShape.index !== null) {
      dispatchShapes({ type: EShapesAction.CHANGE_SHAPE, index: activeShape.index, payload: shape });
    } else {
      dispatchActiveShape({ type: EActiveShapeAction.CHOOSE, payload: shapes.length });
      dispatchShapes({ type: EShapesAction.ADD_SHAPE, payload: shape });
    }
  }

  /**
   * Removes the active shape from the canvas
   */
  const removeActiveShape = (): void => {
    if (activeShape.index !== null) {
      dispatchShapes({ type: EShapesAction.REMOVE_SHAPE, index: activeShape.index });
    }
    dispatchActiveShape({ type: EActiveShapeAction.CHOOSE, payload: null });
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
        removeDot(activeDot.index);
      }
      dispatchActiveDot({ type: EActiveDotAction.INIT });
    }
  }

  /**
   * Adds the given dot to the canvas
   * @param x 
   * @param y 
   */
  const addDot = (x: number, y: number): void => {
    console.log('add dot', dots.length);
    setDots(oldDots => [...oldDots, { x, y }]);
  }

  /**
   * Change the active dot on the canvas
   * @param x 
   * @param y 
   */
  const moveActiveDot = (x: number, y: number): void => {
    console.log('change dot', activeDot);
    if (activeDot.index !== null) {
      const newDots = dots.slice();
      newDots[activeDot.index] = { x, y };
      setDots(newDots);
      dispatchActiveDot({ type: EActiveDotAction.MOVE });
    }
  }

  /**
   * Removes the given dot from the canvas
   * @param removeIndex
   */
  const removeDot = (removeIndex: number): void => {
    console.log('remove dot', removeIndex);
    setDots(dots.filter((dot, index) => index !== removeIndex));
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
    const id = getId(`${shape.type}-${index}`);

    switch (shape.type) {
      case 'rect':
        const props = {
          id: id,
          className: 'shape',
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height
        };

        return (<Rect key={id} {...props} />);
        break;
    }
  });

  return (
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
  );
};