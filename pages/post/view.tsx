import { Component } from 'react';
import Link from 'next/link';

interface Props {
  post: {
    title: string;
  };
}

export default class PostView extends Component<Props, {}> {
  public static async getInitialProps({ query }): Promise<any> {
    // From database
    const posts = [
      { id: 'web-app-security', title: 'Web application security' },
      { id: 'nodejs-web-server', title: 'Create a Node.js web server' },
      { id: 'css-in-js', title: 'Using CSS in JS' },
    ];

    const post = posts.find(p => p.id === query.id);

    return { post };
  }

  public render(): any {
    const { post } = this.props;

    return (
      <div>
        <h2>Pages</h2>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
        </ul>
        <h2>{post.title}</h2>
        <p>This is the blog post content.</p>
      </div>
    );
  }
}
