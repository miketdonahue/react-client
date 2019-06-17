import Link from 'next/link';
import withAuthentication from '../../client/components/hoc/with-authentication';

const About = (): any => (
  <div>
    <h2>Pages</h2>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
    </ul>
    <p>About Page</p>
  </div>
);

export default withAuthentication(About);
