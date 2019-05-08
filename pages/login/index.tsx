import { Component } from 'react';

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
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="email">
              <input
                id="email"
                type="email"
                value={email}
                onChange={this.handleChange}
              />
              Email
            </label>
          </div>
          <div>
            <label htmlFor="password">
              <input
                id="password"
                type="password"
                value={password}
                onChange={this.handleChange}
              />
              Password
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}
