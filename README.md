[![Deno 1.45.0+](https://img.shields.io/badge/Deno-Support%201.45.0-yellowgreen.svg?logo=deno)](https://github.com/denoland/deno/tree/v1.45.0)
[![Vim 9.0.1499+](https://img.shields.io/badge/Vim-Support%209.0.1499%2B-yellowgreen.svg?logo=vim)](https://github.com/vim/vim/tree/v9.0.1499)
[![Neovim 0.8.0+](https://img.shields.io/badge/Neovim-Support%200.8.0-yellowgreen.svg?logo=neovim&logoColor=white)](https://github.com/neovim/neovim/tree/v0.8.0)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![test](https://github.com/kg8m/vim-detect-indent/actions/workflows/checks.yml/badge.svg)](https://github.com/kg8m/vim-detect-indent/actions/workflows/checks.yml)

# vim-detect-indent

A Vim/Neovim plugin to detect indentation options automatically powered by
[denops.vim](https://github.com/vim-denops/denops.vim).

## Usage

Once you install this plugin, indentation options will be detected
automatically.

If you want to customize its behavior, see
[the documentation](doc/vim-detect-indent.txt).

## Similar Plugins / Algorithm

There are great existing similar plugins. For example:

- [vim-findent](https://github.com/lambdalisue/vim-findent)
- [vim-sleuth](https://github.com/tpope/vim-sleuth)
- [detectindent](https://github.com/ciaranm/detectindent)

vim-detect-indent uses simpler algorithm: what majority of indented lines are
indented with. If indented with the hard tab, `noexpandtab` will be set. If
indented with spaces, `expandtab` and `shiftwidth={n}` will be set.
vim-detect-indent's behavior is easy to expect due to its simple algorithm.
vim-detect-indent doesn't cover all indentation cases but aims to work nice in
many common cases.

## Installation

For [dein.vim](https://github.com/Shougo/dein.vim) users:

```vim
call dein#add("kg8m/vim-detect-indent")
```

For [vim-plug](https://github.com/junegunn/vim-plug) users:

```vim
Plug 'kg8m/vim-detect-indent'
```

## Requirements

- Deno
- denops.vim
- Vim or Neovim

Supported version of Deno, Vim, and Neovim depends on denops.vim. Please see
[denops.vim's README](https://github.com/vim-denops/denops.vim#readme).
