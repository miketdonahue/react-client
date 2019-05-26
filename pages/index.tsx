import { PureComponent } from 'react';
import Link from 'next/link';
import withAuthentication from '../client/components/hoc/with-authentication';

class Index extends PureComponent {
  public render(): any {
    return (
      <div>
        <Link href="/about">
          <a>About</a>
        </Link>
        Home Page
      </div>
    );
  }
}

export default withAuthentication(Index);
