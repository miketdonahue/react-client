import { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';

export default class Login extends Component {
  public state = {
    email: '',
    password: '',
  };

  private handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  private handleSubmit = event => {
    event.preventDefault();
  };

  public render(): any {
    const { email, password } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
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
  }
}
