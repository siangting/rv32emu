#include "plic.h"

void plic_update_interrupts(riscv_t *rv)
{
    vm_attr_t *attr = PRIV(rv);
    plic_t *plic = attr->plic;

    /* Update pending interrupts */
    plic->ip |= plic->active & ~plic->masked;
    plic->masked |= plic->active;
    /* Send interrupt to target */
    if (plic->ip & plic->ie) {
        rv->csr_sip |= SIP_SEIP;
    } else
        rv->csr_sip &= ~SIP_SEIP;
}

uint32_t plic_read(riscv_t *rv, const uint32_t addr)
{
    vm_attr_t *attr = PRIV(rv);
    plic_t *plic = attr->plic;

    /* no priority support: source priority hardwired to 1 */
    if (1 <= addr && addr <= 31)
        return 0;

    uint32_t plic_read_val = 0;

    switch (addr) {
    case 0x400:
        plic_read_val = plic->ip;
        break;
    case 0x800:
        plic_read_val = plic->ie;
        break;
    case 0x80000:
        /* no priority support: target priority threshold hardwired to 0 */
        plic_read_val = 0;
        break;
    case 0x80001:
        /* claim */
        {
            uint32_t intr_candidate = plic->ip & plic->ie;
            if (intr_candidate) {
                plic_read_val = ilog2(intr_candidate);
                plic->ip &= ~(1U << (plic_read_val));
            }
            break;
        }
    default:
        return 0;
    }

    return plic_read_val;
}

void plic_write(riscv_t *rv, const uint32_t addr, uint32_t value)
{
    vm_attr_t *attr = PRIV(rv);
    plic_t *plic = attr->plic;

    /* no priority support: source priority hardwired to 1 */
    if (1 <= addr && addr <= 31)
        return;

    switch (addr) {
    case 0x800:
        plic->ie = (value & ~1);
        break;
    case 0x80000:
        /* no priority support: target priority threshold hardwired to 0 */
        break;
    case 0x80001:
        /* completion */
        if (plic->ie & (1U << value))
            plic->masked &= ~(1U << value);
        break;
    default:
        break;
    }

    return;
}
