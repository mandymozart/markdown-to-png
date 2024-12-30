# **CLI Version** `markdown-to-png-cli`

`markdown-to-png-cli` is a command-line tool that converts Markdown files into PNG images using HTML templates for styling. It provides various layout and theme options for generating styled images from your Markdown content. Please refer to `markdown-to-png` for a complete documentation.

## Table of Contents

- [Installation](#installation)
- [CLI Usage](#cli-usage)
  - [Available Options](#available-options)
- [Example Command](#example-command)
- [License](#license)

---

## Installation

To install the `markdown-to-png-cli` globally, run:

```bash
npm install -g markdown-to-png-cli
```

This will allow you to run `markdown-to-png` from the command line.

---

## CLI Usage

Once installed, you can use the `markdown-to-png` CLI tool directly from the command line. This tool converts a Markdown file into PNG images, using an HTML template for styling.

### Running the CLI

To use the tool, run the following command:

```bash
markdown-to-png --input path/to/markdown.md --layout portrait --theme default --limit 5
```

This will generate PNG images from the provided Markdown file (`markdown.md`) with the selected layout and theme.

### Available Options

| Option                | Alias  | Description                                                                                               | Default        |
| --------------------- | ------ | --------------------------------------------------------------------------------------------------------- | -------------- |
| `--input`             | `-i`   | Path to the Markdown input file                                                                           | N/A            |
| `--template`          | `-t`   | Path to the HTML template to use                                                                          | `default.html` |
| `--layout`            | `-l`   | Select the page layout: `portrait`, `square`, or `landscape`                                              | N/A            |
| `--charactersPerPage` | `-c`   | Maximum characters per page (for pagination)                                                              | `72`           |
| `--theme`             | `-m`   | Select the theme: `default`, `monochrome`, `dark-purple`, `medium-purple`, `dark-orange`, `bright-orange` | `default`      |
| `--limit`             | `-lim` | Limit the number of images to generate                                                                    | `10`           |
| `--help`              |        | Show help information                                                                                     |                |

---

### Example Command

```bash
markdown-to-png --input path/to/markdown.md --layout square --theme dark-purple --limit 5
```

This command will:

- Use the specified `markdown.md` file as input.
- Apply the `square` layout.
- Use the `dark-purple` theme.
- Limit the number of generated PNG images to 5.

---

## License

This project is licensed under the MIT License.
