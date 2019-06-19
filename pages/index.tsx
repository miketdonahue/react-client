import { Component } from 'react';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import Cookies from 'universal-cookie';

const PostLink = (props): any => {
  const { id, title } = props;

  return (
    <Link as={`/posts/${id}`} href={`/post?id=${id}`}>
      <a>{title}</a>
    </Link>
  );
};

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
        <h2>Posts</h2>
        <ul>
          <li>
            <PostLink id="web-app-security" title="Web application security" />
          </li>
          <li>
            <PostLink
              id="nodejs-web-server"
              title="Create a Node.js web server"
            />
          </li>
          <li>
            <PostLink id="css-in-js" title="Using CSS in JS" />
          </li>
        </ul>
        <button onClick={this.logout} type="button">
          Logout
        </button>
      </div>
    );
  }
}

export default withRouter(Index);
