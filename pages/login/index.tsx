import { Fragment } from 'react';
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

const Login = ({
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
  </Fragment>
);

export default compose(
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
        .then(({ data }) =>
          client.mutate({
            mutation: mutations.setIsLoggedIn,
            variables: { input: { token: data.user.token } },
          })
        )
        .catch(({ graphQLErrors }) => {
          return formatServerErrors(graphQLErrors);
        });
    },
  })
)(Login);
