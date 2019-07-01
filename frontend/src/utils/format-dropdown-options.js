const formatDropdownOptions = options =>
  Object.entries(options).reduce((opts, [value, text]) => {
    opts.push({ text, value })
    return opts
  }, [])

export default formatDropdownOptions
