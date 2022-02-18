import React, { useEffect, useState } from 'react';
import '../scss/components/SVGEditor.scss';

const getId = (id: string): string => {
  return `svgeditor--${id}`;
}

const getClass = (className: string): string => {
  return `svgeditor--${className}`;
}

type TActiveShape = {
  index: number | null,
  type: 'rect' | 'circle'
};

type TActiveDot = {
  index: number | null,
  moved: boolean
};

type TCoord = {
  x: number,
  y: number
};

interface IObject {
  [key: string]: any
};



/// MAIN COMPONENT

type SVGEditorProps = {
  width?: number,
  height?: number
};

export default function SVGEditor({ width, height }: SVGEditorProps): JSX.Element {

  const [activeShape, setActiveShape] = useState<TActiveShape>({ index: null, type: 'rect' });
  const [activeDot, setActiveDot] = useState<TActiveDot>({ index: null, moved: false });

  const [dots, setDots] = useState<TCoord[]>([]);
  const [shapes, setShapes] = useState<IObject[]>([]);

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

  const handleCanvasClick = (event: React.MouseEvent<SVGElement>): void => {
    const { top, left } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    console.log(x,y);

    switch (activeShape.type) {
      case 'rect':
        if (dots.length < 2) {
          addDot(x, y);
        }
        break;
    }
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<SVGElement>): void => {
    if (activeDot.index !== null) {
      console.log('ACTIVE DOT MOVE', activeDot);
      const { top, left } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      changeDot(x, y);
    }
  }

  const addOrChangeShape = (shape: IObject): void => {
    if (activeShape.index !== null) {
      console.log('change shape', activeShape.index, shape);
      const newShapes = shapes.slice();
      newShapes[activeShape.index] = shape;
      setShapes(newShapes);
    } else {
      console.log('add shape', shapes.length, shape);
      setActiveShape(oldActiveShape => ({...oldActiveShape, index: shapes.length}));
      setShapes(oldShapes => [...oldShapes, shape]);
    }
  }

  const removeActiveShape = (): void => {
    console.log('remove active shape', activeShape.index);
    setShapes(shapes.filter((shape, index) => index !== activeShape.index));
    setActiveShape(oldActiveShape => ({...oldActiveShape, index: null}));
  }


  /// DOT METHODS

  const handleDotClick = (event: React.MouseEvent<SVGCircleElement>): void => {
    event.stopPropagation();

    /*
    const index = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));
    console.log(event.currentTarget, event.currentTarget.id, index);

    removeDot(index);
    */
  }

  const handleDotMouseDown = (event: React.MouseEvent<SVGCircleElement>): void => {
    event.stopPropagation();

    const index = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));
    console.log('ACTIVE DOT START', index);

    setActiveDot({ index, moved: false });
  }

  const handleDotMouseUp = (event: React.MouseEvent<SVGCircleElement>): void => {
    event.stopPropagation();

    const index = parseInt(event.currentTarget.id.replace(/^\D+/g, ''));
    console.log('ACTIVE DOT END', activeDot.index);

    if (activeDot.index !== null && index === activeDot.index) {
      if (!activeDot.moved) {
        removeDot(activeDot.index);
      }
      setActiveDot({ index: null, moved: false });
    }

    
  }

  const addDot = (x: number, y: number): void => {
    console.log('add dot', dots.length);
    setDots(oldDots => [...oldDots, { x, y }]);
  }

  const changeDot = (x: number, y: number): void => {
    console.log('change dot', activeDot);
    if (activeDot.index !== null) {
      const newDots = dots.slice();
      newDots[activeDot.index] = { x, y };
      setDots(newDots);
      setActiveDot(oldActiveDot => ({ ...oldActiveDot, moved: true }));
    }
  }

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
      handleClick: handleDotClick,
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





/// SVG ELEMENT COMPONENTS

type RectProps = {
  id: string,
  className: string,
  x: number,
  y: number,
  width: number,
  height: number
};

function Rect({ id, className, x, y, width, height }: RectProps): JSX.Element {
  return (
    <rect 
      id={id} className={getClass(className)} 
      x={x} y={y} width={width} height={height}
    />
  );
}



type CircleProps = {
  id: string,
  className: string,
  x: number,
  y: number,
  r: number,
  handleClick: (event: React.MouseEvent<SVGCircleElement>) => void,
  handleMouseDown?: (event: React.MouseEvent<SVGCircleElement>) => void,
  handleMouseUp?: (event: React.MouseEvent<SVGCircleElement>) => void
};

/**
 * Draws a circle
 * @param
 * @returns 
 */
function Circle({ id, className, x, y, r, handleClick, handleMouseDown, handleMouseUp }: CircleProps): JSX.Element {
  return (
    <circle 
      id={id} className={getClass(className)} 
      cx={x} cy={y} r={r} 
      onClick={(event) => handleClick(event)}
      onMouseDown={(event) => {if (handleMouseDown) handleMouseDown(event)}}
      onMouseUp={(event) => {if (handleMouseUp) handleMouseUp(event)}}
    />
  );
}