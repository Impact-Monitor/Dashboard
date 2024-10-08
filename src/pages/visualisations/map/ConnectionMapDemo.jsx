import { data } from './data';
import { connectionData } from './connectionData';
import { Map } from './Map';

const ConnectionMapDemo = ({ width = 700, height = 400 }) => {
  if (width === 0) {
    return null;
  }
  return (
    <Map
      data={data}
      connectionData={connectionData}
      width={width}
      height={height}
    />
  );
};

export default ConnectionMapDemo;
