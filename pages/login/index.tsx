import { PureComponent } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { ApolloConsumer, Mutation } from 'react-apollo';
import * as mutations from './graphql/mutations.graphql';

interface Props {
  setIsLoggedIn: (object) => void;
}

interface State {
  email: string;
  password: string;
}

interface Data {
  user: {
    token: string;
  };
}

class Login extends PureComponent<Props, State> {
  public state = {
    email: '',
    password: '',
  };

  private handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    } as any);
  };

  private handleSubmit = (event, loginUser) => {
    event.preventDefault();

    const { email, password } = this.state;

    loginUser({ variables: { input: { email, password } } });
  };

  public render(): any {
    const { email, password } = this.state;

    return (
      <ApolloConsumer>
        {client => (
          <Mutation<Data>
            mutation={mutations.loginUser}
            onCompleted={({ user }) =>
              client.mutate({
                mutation: mutations.setIsLoggedIn,
                variables: { input: { token: user.token } },
              })
            }
          >
            {(loginUser, { loading, error }): any => {
              if (loading) return <div>Loading...</div>;
              if (error) return <p>An error occurred</p>;

              return (
                <Form onSubmit={e => this.handleSubmit(e, loginUser)}>
                  <Form.Field>
                    <label htmlFor="email">
                      Email
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={this.handleChange}
                      />
                    </label>
                  </Form.Field>
                  <Form.Field>
                    <label htmlFor="password">
                      Password
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                      />
                    </label>
                  </Form.Field>
                  <Button type="submit">Login</Button>
                </Form>
              );
            }}
          </Mutation>
        )}
      </ApolloConsumer>
    );
  }
}

export default Login;
