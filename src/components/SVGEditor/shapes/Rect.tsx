import { getClass } from '../functions';

type RectProps = {
  id: string,
  className: string,
  x: number,
  y: number,
  width: number,
  height: number,
  handleClick?: (event: React.MouseEvent<SVGRectElement>) => void,
};

/**
 * Draws an SVG rectangle element
 */
export default function Rect({ id, className, x, y, width, height, handleClick }: RectProps): JSX.Element {
  return (
    <rect 
      id={id} className={getClass(className)} 
      x={x} y={y} width={width} height={height}
      onClick={event => {if (handleClick) handleClick(event)}}
    />
  );
};