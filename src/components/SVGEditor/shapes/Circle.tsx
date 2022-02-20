import { getClass } from '../functions';

type CircleProps = {
  id: string,
  className: string,
  x: number,
  y: number,
  r: number,
  handleClick?: (event: React.MouseEvent<SVGCircleElement>) => void,
  handleContextMenu?: (event: React.MouseEvent<SVGCircleElement>) => void,
  handleMouseDown?: (event: React.MouseEvent<SVGCircleElement>) => void
};

/**
 * Draws an SVG circle element
 */
export default function Circle({ id, className, x, y, r, handleClick, handleContextMenu, handleMouseDown }: CircleProps): JSX.Element {
  return (
    <circle 
      id={id} className={getClass(className)} 
      cx={x} cy={y} r={r} 
      onClick={event => {if (handleClick) handleClick(event)}}
      onContextMenu={event => {if (handleContextMenu) handleContextMenu(event)}}
      onMouseDown={event => {if (handleMouseDown) handleMouseDown(event)}}
    />
  );
};