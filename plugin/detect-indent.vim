if exists("g:loaded_detect_indent")
  finish
endif
let g:loaded_detect_indent = 1

if get(g:, "detect_indent_default_commands", 1)
  command! DetectIndent        call detect_indent#detect()
  command! DetectIndentRestore call detect_indent#restore()
endif

if get(g:, "detect_indent_default_autocmds", 1)
  augroup detect-indent
    autocmd!
    autocmd FileType * call detect_indent#detect()
  augroup END
endif
