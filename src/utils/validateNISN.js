export const validateNISN = (nisn) => {
    if(nisn.length > 9)
    return true;
    else
    return false;
}