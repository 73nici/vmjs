import { createMemory } from './create-memory'
import { Instructions } from './instructions'
import { Registers, toStringRegister } from './registers'

class CPU {
    private memory: DataView
    private registerNames: Array<Registers>
    private registers: DataView
    private readonly registerMap: { [key: string]: number }

    constructor(memory: DataView) {
        this.memory = memory

        this.registerNames = [
            Registers.IP, Registers.ACC,
            Registers.R1, Registers.R2, Registers.R3, Registers.R4,
            Registers.R5, Registers.R6, Registers.R7, Registers.R8,
            Registers.SP, Registers.FP
        ]

        this.registers = createMemory(this.registerNames.length * 2)
        this.registerMap = this.registerNames.reduce((map: { [key: string]: number }, name, i) => {
            map[name] = i * 2
            return map
        }, {})

        this.setRegister(Registers.SP, memory.byteLength - 2)
        this.setRegister(Registers.FP, memory.byteLength - 2)
    }

    public getRegister(name: Registers) {
        if (!(name in this.registerMap)) {
            throw new Error(`getRegister: no such register found '${name}'`)
        }
        return this.registers.getUint16(this.registerMap[name])
    }

    private setRegister(name: Registers, value: number) {
        if (!(name in this.registerMap)) {
            throw new Error(`setRegister: no such register found '${name}'`)
        }
        return this.registers.setUint16(this.registerMap[name], value)
    }

    private fetch(): number {
        const nextInstructionAddress = this.getRegister(Registers.IP)
        const instruction = this.memory.getUint8(nextInstructionAddress)
        this.setRegister(Registers.IP, nextInstructionAddress + 1)
        return instruction
    }

    private fetch16(): number {
        const nextInstructionAddress = this.getRegister(Registers.IP)
        const instruction = this.memory.getUint16(nextInstructionAddress)
        this.setRegister(Registers.IP, nextInstructionAddress + 2)
        return instruction
    }

    private push(value: number): void {
        const spAddress = this.getRegister(Registers.SP)
        this.memory.setUint16(spAddress, value)
        this.setRegister(Registers.SP, spAddress - 2)
    }

    private pop(): number {
        const nextSpAddress = this.getRegister(Registers.SP) + 2
        this.setRegister(Registers.SP, nextSpAddress)
        return this.memory.getUint16(nextSpAddress)
    }

    private fetchRegisterIndex(): number {
        return (this.fetch() % this.registerNames.length) * 2
    }

    private execute(instruction: number) {
        switch (instruction) {
            case Instructions.MOV_LIT_REG: {
                const literal = this.fetch16()
                const register = this.fetchRegisterIndex()
                this.registers.setUint16(register, literal)
                return
            }

            case Instructions.MOV_REG_REG: {
                const registerFrom = this.fetchRegisterIndex()
                const registerTo = this.fetchRegisterIndex()
                const value = this.registers.getUint16(registerFrom)
                this.registers.setUint16(registerTo, value)
                return
            }

            case Instructions.MOV_REG_MEM: {
                const registerFrom = this.fetchRegisterIndex()
                const address = this.fetch16()
                const value = this.registers.getUint16(registerFrom)
                this.memory.setUint16(address, value)
                return
            }

            case Instructions.MOV_MEM_REG: {
                const address = this.fetch16()
                const registerTo = this.fetchRegisterIndex()
                const value = this.memory.getUint16(address)
                this.registers.setUint16(registerTo, value)
                return
            }

            case Instructions.ADD_REG_REG: {
                const r1 = this.fetchRegisterIndex()
                const r2 = this.fetchRegisterIndex()
                const r1Value = this.registers.getUint16(r1)
                const r2Value = this.registers.getUint16(r2)

                this.setRegister(Registers.ACC, r1Value + r2Value)
                return
            }

            case Instructions.JMP_NOT_EQ: {
                const value = this.fetch16()
                const address = this.fetch16()

                if (value !== this.getRegister(Registers.ACC)) {
                    this.setRegister(Registers.IP, address);
                }

                return
            }

            case Instructions.PSH_LIT: {
                const value = this.fetch16()
                this.push(value)
                return
            }

            case Instructions.PSH_REG: {
                const registerIndex = this.fetchRegisterIndex()
                const value = this.registers.getUint16(registerIndex)
                this.push(value)
                return
            }

            case Instructions.POP: {
                const registerIndex = this.fetchRegisterIndex()
                const value = this.pop()

                this.registers.setUint16(registerIndex, value)
            }
        }
    }

    public step() {
        const instruction = this.fetch()
        return this.execute(instruction)
    }

    public debug() {
        this.registerNames.forEach(name => {
            console.log(`${toStringRegister(name)}:${this.getRegister(name).toString(16).padStart(4, '0')}`)
        })
        console.log('-----------------')
    }

    public viewMemoryAt(address: number) {
        const nextEightBytes = Array.from({ length: 8 }, (_, i) =>
            this.memory.getUint8(address + i),
        ).map(v => `0x${v.toString(16).padStart(2, '0')}`)

        console.log(`0x${address.toString(16).padStart(4, '0')}: ${nextEightBytes.join(' ')}`)
    }
}

export default CPU