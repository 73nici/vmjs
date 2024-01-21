export enum Registers {
    IP,
    ACC ,
    R1 ,
    R2,
    R3 ,
    R4 ,
    R5 ,
    R6 ,
    R7 ,
    R8 ,
    SP,
    FP,
}

export const toStringRegister = (register: Registers): string => {
    switch (register) {
        case Registers.IP:
            return 'IP'
        case Registers.ACC:
            return 'ACC'
        case Registers.R1:
            return 'R1'
        case Registers.R2:
            return 'R2'
        case Registers.R3:
            return 'R3'
        case Registers.R4:
            return 'R4'
        case Registers.R5:
            return 'R5'
        case Registers.R6:
            return 'R6'
        case Registers.R7:
            return 'R7'
        case Registers.R8:
            return 'R8'
        case Registers.SP:
            return 'SP'
        case Registers.FP:
            return 'FP'
    }
}