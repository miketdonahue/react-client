import { Fragment } from 'react';
import Router from 'next/router';
import { withFormik } from 'formik';
import { Button, Form } from 'semantic-ui-react';
import { withApollo, compose } from 'react-apollo';
import ServerError from '@client/components/server-error';
import withServerErrors from '@client/components/hoc/with-server-errors';
import { loginSchema } from './validations';
import * as mutations from './graphql/mutations.graphql';

interface Props {
  client: any;
  formatServerErrors: (array) => void;
  setIsLoggedIn: (object) => void;
}

interface State {
  email: string;
  password: string;
  errors?: any;
}

const LoginView = ({
  values,
  handleChange,
  handleSubmit,
  errors,
  touched,
  serverErrors,
}): any => (
  <Fragment>
    <ServerError errors={serverErrors} />

    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
        </label>
        {errors.email && touched.email ? <div>{errors.email}</div> : null}
      </Form.Field>
      <Form.Field>
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
        </label>
      </Form.Field>
      <Button type="submit">Login</Button>
    </Form>

    <a href="/oauth/google">Login with Google</a>
  </Fragment>
);

export const Login = compose(
  withApollo,
  withServerErrors,
  withFormik<Props, State>({
    displayName: 'LoginForm',
    mapPropsToValues: () => ({
      email: '',
      password: '',
    }),
    validationSchema: loginSchema,
    handleSubmit: (
      values,
      { setSubmitting, props: { client, formatServerErrors } }
    ) => {
      client
        .mutate({
          mutation: mutations.loginUser,
          variables: {
            input: { email: values.email, password: values.password },
          },
        })
        .then(async ({ data }) => {
          await client.mutate({
            mutation: mutations.setIsLoggedIn,
            variables: { input: { token: data.user.token } },
          });

          return Router.push('/');
        })
        .catch(({ graphQLErrors }) => {
          return formatServerErrors(graphQLErrors);
        });
    },
  })
)(LoginView);
