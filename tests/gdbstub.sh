#!/usr/bin/env bash

build/rv32emu --gdbstub build/puzzle.elf &
PID=$!

# Before starting GDB, we should ensure rv32emu is still running.
if ps -p $PID > /dev/null
then
    tmpfile=/tmp/rv32emu-gdbstub.$PID
    breakpoint_arr=(0x10700 0x10800 0x10900)
    GDB_COMMANDS="riscv32-unknown-elf-gdb --batch "
    GDB_COMMANDS+="-ex 'file build/puzzle.elf' "
    GDB_COMMANDS+="-ex 'target remote :1234' "
    for t in ${breakpoint_arr[@]}; do
        GDB_COMMANDS+="-ex 'break *$t' "
    done
    for i in {1..3}; do
        GDB_COMMANDS+="-ex 'continue' "
        GDB_COMMANDS+="-ex 'print \$pc' "
    done
    for i in {1..3}; do
        GDB_COMMANDS+="-ex 'del $i' "
    done
    GDB_COMMANDS+="-ex 'stepi' "
    GDB_COMMANDS+="-ex 'stepi' "
    GDB_COMMANDS+="-ex 'continue' "

    eval ${GDB_COMMANDS} > ${tmpfile}

    # check if we stop at the breakpoint
    for i in {1..3}
    do
        expected=$(grep -rw "Breakpoint ${i} at" ${tmpfile} | awk {'print $4'})
        ans=$(grep -r "\$${i} =" ${tmpfile} | awk {'print $5'})
        if [ "$expected" != "$ans" ]; then
            # Fail
            exit 1
        fi
    done
    # Pass and wait
    exit 0
    wait $PID
fi

exit 1