function Span(span)
  if span.attributes['style'] and string.find(span.attributes['style'], 'underline') then
    return pandoc.RawInline('html', '<u>' .. pandoc.utils.stringify(span) .. '</u>')
  end
end