<?php

namespace eCamp\Lib\Types;

use eCamp\Lib\Service\EntityValidationException;
use Exception;

class InvalidDateFormatException extends EntityValidationException {
    public function __construct($message, $code = 0, Exception $previous = null) {
        parent::__construct($message, $code, $previous);

        parent::setMessages(['invalidDateFormat' => $message]);
    }
}
