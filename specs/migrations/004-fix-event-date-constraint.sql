-- Modificar el constraint de fecha del evento
-- Cambiar de event_date > CURRENT_DATE a event_date >= CURRENT_DATE
-- Esto permite crear eventos para el día de hoy

-- Eliminar el constraint antiguo
ALTER TABLE requests DROP CONSTRAINT IF EXISTS valid_event_date;

-- Agregar el nuevo constraint que permite fechas desde hoy (inclusive)
ALTER TABLE requests ADD CONSTRAINT valid_event_date CHECK (event_date >= CURRENT_DATE);
