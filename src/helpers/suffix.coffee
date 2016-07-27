module.exports = (n) ->
  d = (n|0) % 100
  if d > 3 and d < 21 then 'th' else ['th', 'st', 'nd', 'rd'][d%10] or 'th'
