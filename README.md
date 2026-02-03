# Land Cover Change Decision Tool

A static website that guides users through decision trees to determine appropriate methods and software for land cover change analysis.

## Features

- **Interactive Decision Trees**: Two sequential assessments (Demand and Vulnerability)
- **Progress Tracking**: Visual progress indicator showing current step
- **Back Navigation**: Ability to revise previous answers
- **Tree Visualization**: Final page displays complete trees with selected paths highlighted
- **Responsive Design**: Mobile-friendly, minimalist interface
- **Easy Configuration**: Modify trees by editing JSON files

## Project Structure

```
/
├── index.html              # Landing page with preamble
├── demand.html             # Demand decision tree
├── vulnerability.html      # Vulnerability decision tree
├── result.html             # Generic result page for end nodes
├── recommendation.html     # Final recommendation page
├── css/
│   └── styles.css          # Minimalist styling
├── js/
│   ├── tree-engine.js      # Core decision tree logic
│   └── app.js              # Page-specific logic
└── data/
    ├── demand.json         # Demand tree configuration
    ├── vulnerability.json  # Vulnerability tree configuration
    ├── recommendations.json # Software recommendation rules
    └── results.json        # End node detail content
```

## Usage

### Local Development

Simply open `index.html` in a web browser. No build step required.

### GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Select branch (e.g., `main`) and root directory
4. Save and wait for deployment
5. Access at `https://[username].github.io/[repository-name]/`

## Customization

### Modifying Decision Trees

Edit the JSON files in the `data/` directory:

**`data/demand.json`** or **`data/vulnerability.json`**:
```json
{
  "treeName": {
    "question": "Your question here?",
    "yes": {
      "question": "Follow-up question?",
      "yes": {
        "outcome": {
          "id": "D1",
          "action": "Recommended action"
        }
      },
      "no": {
        "outcome": {
          "id": "D2",
          "action": "Alternative action"
        }
      }
    },
    "no": {
      "outcome": {
        "id": "D3",
        "action": "Another action"
      }
    }
  }
}
```

### Updating Result Descriptions

Edit `data/results.json`:
```json
{
  "D1": {
    "action": "Use existing estimate",
    "description": "Detailed description of this recommendation..."
  }
}
```

### Modifying Recommendation Rules

Edit `data/recommendations.json`:
```json
{
  "rules": [
    {
      "if": {
        "vulnerability": ["V1", "V2"],
        "demand": ["D1"]
      },
      "recommend": [
        "Software Name"
      ]
    }
  ]
}
```

### Styling

Modify CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #2c3e50;
    --accent-color: #3498db;
    /* ... other variables */
}
```

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.

## License

MIT License - Feel free to use and modify as needed.
