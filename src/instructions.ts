export enum Instructions {
    /**
     * Moves a 16 bit literal into a register.
     * Example in bytecode:
     * 0x10 -> instruction type (MOV_LIT_REG)
     * 0x00 -> first byte of value
     * 0x10 -> second byte of value
     * 0x02 -> Register type (R1)
     */
    MOV_LIT_REG = 0x10,

    /**
     * Moves a 16 bit value from a register to another register.
     * Example in bytecode:
     * 0x11 -> instruction type (MOV_REG_REG)
     * 0x02 -> from register (R1)
     * 0x03 -> to register (R2)
     */
    MOV_REG_REG,

    /**
     * Moves a 16 bit value from a register to a memory address.
     * Example in bytecode:
     * 0x12 -> instruction type (MOV_REG_MEM)
     * 0x02 -> from register (R1)
     * 0x20 -> first byte of memory address
     * 0x00 -> second byte of memory address
     */
    MOV_REG_MEM,

    /**
     * Moves a 16 bit value from a memory address to a register.
     * Example in bytecode:
     * 0x13 -> instruction type (MOV_MEM_REG)
     * 0x20 -> first byte of memory address
     * 0x00 -> second byte of memory address
     * 0x02 -> to register (R1)
     */
    MOV_MEM_REG,

    /**
     * Adds the value of 2 registers and writes it to the accumulator.
     * Example in bytecode:
     * 0x14 -> instruction type (ADD_REG_REG)
     * 0x02 -> register 1 (R1)
     * 0x03 -> register 2 (R2)
     */
    ADD_REG_REG,

    /**
     * Compares a 16 bit value with the accumulator and if the values don't match jump to a memory address.
     * Example in bytecode:
     * 0x15 -> instruction type (JMP_NOT_EQ)
     * 0x00 -> first byte of value
     * 0x10 -> second byte of value
     * 0x20 -> first byte of memory address to jump
     * 0x00 -> second byte of memory address to jump
     */
    JMP_NOT_EQ,

    PSH_LIT,
    PSH_REG,
    POP,
}


export const toStringInstruction = (instruction: Instructions): string => {
    switch (instruction) {
        case Instructions.MOV_LIT_REG:
            return 'MOV_LIT_REG'
        case Instructions.MOV_REG_REG:
            return 'MOV_REG_REG'
        case Instructions.MOV_REG_MEM:
            return 'MOV_REG_MEM'
        case Instructions.MOV_MEM_REG:
            return 'MOV_REG_MEM'
        case Instructions.ADD_REG_REG:
            return 'ADD_REG_REG'
        case Instructions.JMP_NOT_EQ:
            return 'JMP_NOT_EQ'
        case Instructions.PSH_LIT:
            return 'PSH_LIT'
        case Instructions.PSH_REG:
            return 'PSH_REG'
        case Instructions.POP:
            return 'POP'
    }
}