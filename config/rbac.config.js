export default [
  {a: 'admin', can: 'create'},
  {a: 'admin', can: 'update'},
  {a: 'admin', can: 'list'},
  
  {a: 'tester', can: 'list'},
  {
    a: 'tester', can: 'update',
    when: (req, callback) => {
      callback(false, req.authUser._id === req.params.userId)
    },
  },
]
