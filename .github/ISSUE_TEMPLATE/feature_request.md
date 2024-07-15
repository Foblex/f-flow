name: 🎛️ Feature Request
description: Suggest an idea for Foblex Flow
title: ''
labels: 
  - enhancement
  - feature request
assignees: 
  - siarheihuzarevich
  - markwojno
body:
  - type: markdown
    attributes:
      value: |
        ## Feature Description
        Please provide a clear and concise description of the feature you want to propose.

  - type: textarea
    id: description
    attributes:
      label: Description
      description: A clear and concise description of what you want to happen.
    validations:
      required: true

  - type: markdown
    attributes:
      value: |
        ## Justification
        Explain why this feature is important and how it will benefit users.

  - type: textarea
    id: justification
    attributes:
      label: Justification
      description: Explain why this feature is important and how it will benefit users.
    validations:
      required: true

  - type: markdown
    attributes:
      value: |
        ## Alternatives
        Describe any alternative solutions or features you've considered.

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives
      description: Describe any alternative solutions or features you've considered.
    validations:
      required: false

  - type: markdown
    attributes:
      value: |
        ## Additional Context
        Add any other context or screenshots about the feature request here.

  - type: textarea
    id: additional_context
    attributes:
      label: Additional Context
      description: Add any other context or screenshots about the feature request here.
    validations:
      required: false
