#pragma once

#include "riscv_private.h"

void plic_update_interrupts(riscv_t *rv);
uint32_t plic_read(riscv_t *rv, const uint32_t addr);
void plic_write(riscv_t *rv, const uint32_t addr, uint32_t value);
