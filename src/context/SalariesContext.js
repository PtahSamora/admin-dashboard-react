import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const SalariesContext = createContext();

export const SalariesProvider = ({ children }) => {
  const [salaries, setSalaries] = useState([]);

  return (
    <SalariesContext.Provider value={{ salaries, setSalaries }}>
      {children}
    </SalariesContext.Provider>
  );
};

SalariesProvider.propTypes = {
  children: PropTypes.node.isRequired, // Add PropTypes validation for children
};
