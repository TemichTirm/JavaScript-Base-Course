
    function getIntNumber(request, min, max) {
        let condition = false;
        let input
        do {
            input = +prompt(request);
            condition = isNaN(input) || !Number.isInteger(input);
            if (condition) {
                alert("Вы ввели не целое числовое значение, пожалуйста повторите ввод!");                
            }
            else if (min !== undefined) {
                condition = input < min;
                if (condition) {
                    alert("Введенное вами число должно быть больше или равно " + min + ", пожалуйста повторите ввод!");
                    continue;
                }
            }
            if (max !== undefined) {
                condition = input > max;
                if (condition) {
                    alert("Введенное вами число должно быть меньше или равно " + max + ", пожалуйста повторите ввод!"); 
                }                 
            }
        } while (condition);
        return input;
    }
