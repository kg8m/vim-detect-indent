let g:detect_indent#detect_once         = get(g:, "detect_indent#detect_once", 1)
let g:detect_indent#ignore_filetypes    = get(g:, "detect_indent#ignore_filetypes", [])
let g:detect_indent#ignore_buftypes     = get(g:, "detect_indent#ignore_buftypes", [])
let g:detect_indent#silence_warnings    = get(g:, "detect_indent#silence_warnings", 0)
let g:detect_indent#silence_information = get(g:, "detect_indent#silence_information", 0)

let s:PLUGIN_NAME = "detect-indent"

function detect_indent#detect() abort
  call denops#plugin#wait_async(s:PLUGIN_NAME, function("s:detect"))
endfunction

function detect_indent#restore() abort
  call denops#plugin#wait_async(s:PLUGIN_NAME, function("s:restore"))
endfunction

function s:detect() abort
  call denops#notify(s:PLUGIN_NAME, "detect", [])
endfunction

function s:restore() abort
  call denops#notify(s:PLUGIN_NAME, "restore", [])
endfunction
