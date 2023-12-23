# Prerequisites
1. Installed [emcc](https://emscripten.org/docs/getting_started/downloads.html)
2. Installed python3

# Serve rv32emu in web
1. `git clone https://github.com/ChinYikMing/rv32emu.git -b wasm`
2. `make CC=emcc ENABLE_SDL=0 ENABLE_GDBSTUB=0`
3. `make serve-wasm`
4. Go to `localhost:8000/rv32emu.html` or `127.0.0.1:8000/rv32emu.html` and there you go!
