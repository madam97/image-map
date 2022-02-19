import { MapArray } from '../../../functions';
import { getClass } from '../functions';
import { TCoord } from './Dot';

type PolyProps = {
  id: string,
  className: string,
  points: MapArray<TCoord>,
  handleClick?: (event: React.MouseEvent<SVGPolygonElement>) => void,
};

/**
 * Draws an SVG polygon element
 */
export default function Poly({ id, className, points, handleClick }: PolyProps): JSX.Element {
  return (
    <polygon 
      id={id} className={getClass(className)} 
      points={points.map(point => (
        point.x + ',' + point.y
      )).join(' ')}
      onClick={event => {if (handleClick) handleClick(event)}}
    />
  );
};