import Icon from '@mdi/react';
import { mdiSkullCrossbones } from '@mdi/js';

export default function NotFound() {
  return <h1 className="not-found">This is awkward...<Icon path={mdiSkullCrossbones} size={15} /></h1>
}