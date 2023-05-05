const customStyles = {
  control: (styles) => ({
    ...styles,
    width: '50%',
    height: '50px',
    borderRadius: '5px',
    color: '#000',
    fontSize: '1.25rem',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    border: '2px solid #000000',
    boxShadow: '5px 5px 0px 0px rgba(0,0,0);',
    ':hover': {
      border: '2px solid #000000',
      boxShadow: 'none',
    },
  }),
  option: (styles) => ({
    ...styles,
    color: '#000',
    fontSize: '1rem',
    lineHeight: '1.75rem',
    width: '100%',
    background: '#fff',
    ':hover': {
      backgroundColor: 'rgb(243 244 246)',
      color: '#000',
      cursor: 'pointer',
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: '#fff',
    maxWidth: '20rem',
    border: '2px solid #000000',
    borderRadius: '5px',
    boxShadow: '5px 5px 0px 0px rgba(0,0,0);',
  }),

  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: '#000',
    fontSize: '1rem',
    lineHeight: '1.75rem',
  }),
};
export default customStyles;
