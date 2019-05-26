import React from 'react';

const ServerErrors = ({ errors }): any => {
  return (
    <div>
      {errors.map(error => {
        return <div>{error.message}</div>;
      })}
    </div>
  );
};

export default ServerErrors;
