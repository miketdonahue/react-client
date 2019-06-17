import { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Cookies from 'universal-cookie';
import withAuthentication from '@client/components/hoc/with-authentication';

class Index extends Component {
  private logout = () => {
    const cookies = new Cookies();
    cookies.remove('jwt', { path: '/' });

    return Router.push('/login');
  };

  public render(): any {
    return (
      <div>
        <h2>Pages</h2>
        <ul>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
        </ul>
        <p>Home Page</p>
        <button onClick={this.logout} type="button">
          Logout
        </button>
      </div>
    );
  }
}

export default withAuthentication(Index);
