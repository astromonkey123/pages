mutable struct Battery
    emf::Float64
    links::Vector
    circuits::Vector
end

mutable struct Resistor
    resistance::Float64
    current::Float64
    links::Vector
    circuits::Vector
end

mutable struct Capacitor
    capacitance::Float64
    current_integral::Float64
    links::Vector
    circuits::Vector
end

mutable struct Inductor
    inductance::Float64
    current_derivative::Float64
    links::Vector
    circuits::Vector
end

mutable struct Circuit
    elements::Vector
    current::Float64
    current_integral::Float64
    current_derivative::Float64
    elapsed_time::Float64
end