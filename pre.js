Module['noInitialRun'] = true;
Module['noExitRuntime'] = true; // need this?
Module['onRuntimeInitialized'] = function(target_elf) {
    if(target_elf === undefined)
      return;

    var opt_prog_name = stringToNewUTF8(`build/${target_elf}`);
    var elf = Module._elf_new();
    var file = Module._elf_open(elf, opt_prog_name);
    var state = Module._state_new(64 * 128 * 1024);
    var end = Module._elf_get_symbol(elf, stringToNewUTF8("_end"));
    if(end){
      Module.setValue(state + 4, Module.getValue(end + 4), "i32");
    }

    var io = Module._malloc(1024);
    var ifetch = Module.addFunction(Module._on_mem_ifetch, "ii");
    var read_w = Module.addFunction(Module._on_mem_read_w, "ii");
    var read_s = Module.addFunction(Module._on_mem_read_s, "ii");
    var read_b = Module.addFunction(Module._on_mem_read_b, "ii");
    var write_w = Module.addFunction(Module._on_mem_write_w, "vii");
    var write_s = Module.addFunction(Module._on_mem_write_s, "vii");
    var write_b = Module.addFunction(Module._on_mem_write_b, "vii");
    var ecall_handler = Module.addFunction(Module._ecall_handler, "vi");
    var ebreak_handler = Module.addFunction(Module._ebreak_handler, "vi");
    var memcpy_handler = Module.addFunction(Module._memcpy_handler, "vi");
    var memset_handler = Module.addFunction(Module._memset_handler, "vi");
    var opt_misaligned = 0;
    Module.setValue(io, ifetch, "i32");
    Module.setValue(io + 4, read_w, "i32");
    Module.setValue(io + 8, read_s, "i32");
    Module.setValue(io + 12, read_b, "i32");
    Module.setValue(io + 16, write_w, "i32");
    Module.setValue(io + 20, write_s, "i32");
    Module.setValue(io + 24, write_b, "i32");
    Module.setValue(io + 28, ecall_handler, "i32");
    Module.setValue(io + 32, ebreak_handler, "i32");
    Module.setValue(io + 36, memcpy_handler, "i32");
    Module.setValue(io + 40, memset_handler, "i32");
    Module.setValue(io + 44, opt_misaligned, "i32");

    var rv = Module._rv_create(io, state, 1, opt_prog_name, 1);

    var mem = Module.getValue(state, "i8*");
    var elf_load_ret = Module._elf_load(elf, rv, mem);
    if(!elf_load_ret) {
        console.log("elf load failed");
        return;
    }

    var cycle_per_step = 100;
    for(; !Module._rv_has_halted(rv);){
      Module._rv_step(rv,cycle_per_step);
    }

    Module._free(io);
    Module._elf_delete(elf);
    Module._rv_delete(rv);
    Module._state_delete(state);
  };