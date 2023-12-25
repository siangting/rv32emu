/*
 * rv32emu is freely redistributable under the MIT License. See the file
 * "LICENSE" for information on usage and redistribution of this file.
 */

#pragma once

#include <stdint.h>
#include <string.h>

/*
 * set memory size to 2^32 - 1 bytes
 *
 * The memory size is set to 2^32 - 1 bytes in order to make this emulator
 * portable for both 32-bit and 64-bit platforms. As a result, it can access
 * any segment of the memory on either platform. Furthermore, it is safe
 * because most of the test cases' data memory usage will not exceed this
 * memory size.
 */
#define MEM_SIZE 0xFFFFFFFFULL

typedef struct {
    uint8_t *mem_base;
    uint64_t mem_size;
} memory_t;

memory_t *memory_new(uint32_t mem_size);
void memory_delete(memory_t *m);

/* read a C-style string from memory */
uint32_t memory_read_str(const memory_t *m,
                         uint8_t *dst,
                         uint32_t addr,
                         uint32_t max);

/* read an instruction from memory */
uint32_t memory_ifetch(uint32_t addr);

/* read a word from memory */
uint32_t memory_read_w(uint32_t addr);

/* read a short from memory */
uint16_t memory_read_s(uint32_t addr);

/* read a byte from memory */
uint8_t memory_read_b(uint32_t addr);

/* read a length of data from memory */
void memory_read(const memory_t *m, uint8_t *dst, uint32_t addr, uint32_t size);

static inline void memory_write(memory_t *m,
                                uint32_t addr,
                                const uint8_t *src,
                                uint32_t size)
{
    memcpy(m->mem_base + addr, src, size);
}

void memory_write_w(uint32_t addr, const uint32_t src);

void memory_write_s(uint32_t addr, const uint16_t src);

void memory_write_b(uint32_t addr, const uint8_t src);

static inline void memory_fill(memory_t *m,
                               uint32_t addr,
                               uint32_t size,
                               uint8_t val)
{
    memset(m->mem_base + addr, val, size);
}
