This README informs developers on how to use pandoc to create .md files from the .docx project documents.

# Requirements

Install pandoc on your system. https://pandoc.org

# Warning to write access users of this folder.

Leave underline.lua alone, it's for converting .docx to .md

# Converting from .docx to .md:

When converting .docx to .md, use the following terminal commands (make sure you're in the working directory where the .docx and underline.lua is located):

```
// Template code: Replace:
pandoc '[insert source filename].docx' -o '[insert output filename].md' --from=docx --to=gfm --extract-media='[insert output filename]Media' --standalone --wrap=preserve --lua-filter=underline.lua --toc

// For the 'Design Document.docx':
pandoc 'Design Document.docx' -o 'DesignDocument.md' --from=docx --to=gfm --extract-media='design_document_media' --standalone --wrap=preserve --lua-filter=underline.lua --toc

// For the 'Project Management.docx':
pandoc 'Project Management.docx' -o 'ProjectManagement.md' --from=docx --to=gfm --extract-media='project_management_media' --standalone --wrap=preserve --lua-filter=underline.lua --toc
```

### Post pandoc editing of .md files:

After converting from .docx to .md, the .docx version of the Table of Contents (TOC) will remain unformatted (pandoc creates its own), the Title line from the .docx is also removed (pandoc doesn't conver Title headers). Remove the subtitle line and unformatted table of contents from the .md file before publishing.
