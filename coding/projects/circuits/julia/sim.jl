include("objects.jl")
include("plot.jl")

const dt = 1e-2

function print_loop(loop)
    println("----- loop -----")
    for (i, element) in enumerate(loop)
        println("#$( i ): $( element )")
    end
end

function find_circuits(objects)
    loops = []

    println("----- finding circuits -----")

    for start_object in objects
        if (length(start_object.links) == 0) continue end
        acting_loop = find_loop([start_object])

        is_unique = true
        for loop in loops
            if isequal(Set(acting_loop), Set(loop))
                is_unique = false
            end
        end

        if is_unique
            push!(loops, acting_loop)
        end
    end

    # Convert loops to circuits
    circuits = []

    for loop in loops
        push!(circuits, Circuit(loop, 0, 0, 0, 0))
    end

    for circuit in circuits
        for element in circuit.elements
            push!(element.circuits, circuit)
        end
    end

    return circuits
end

function find_loop(loop)
    next_elements = loop[end].links

    if loop[begin] in next_elements
        return loop
    end

    return find_loop([loop..., next_elements[begin]])
end

function step_sim(circuit)
    delta_v_functions = []

    for element in circuit.elements
        if typeof(element) == Battery
            push!(delta_v_functions, current -> element.emf)
        elseif typeof(element) == Resistor
            other_currents = 0

            for other_circuit in element.circuits
                if (circuit == other_circuit) continue end
                other_currents += other_circuit.current
            end

            push!(delta_v_functions, current -> -(other_currents + current) * element.resistance)
        elseif typeof(element) == Inductor
            other_derivatives = 0

            for other_circuit in element.circuits
                if (circuit == other_circuit) continue end
                other_derivatives += other_circuit.current_derivative
            end

            push!(delta_v_functions, current -> -( other_derivatives + ( (current - circuit.current) / dt ) ) * element.inductance)
        elseif typeof(element) == Capacitor
            other_integrals = element.current_integral

            for other_circuit in element.circuits
                if (circuit == other_circuit) continue end
                other_integrals += other_circuit.current_integral
            end

            push!(delta_v_functions, current -> -( other_integrals + ( current * dt )) / element.capacitance)
        end 
    end

    delta_v(current) = sum([delta_v_function(current) for delta_v_function in delta_v_functions])
    slope = (delta_v(1) - delta_v(0))
    current = delta_v(0) / -slope

    return current
end

function step_object(element)
    member_circuits = element.circuits
    if (length(member_circuits) == 0) return end

    if typeof(element) == Resistor
        element.current = sum([circuit.current for circuit in member_circuits])

    elseif typeof(element) == Inductor
        element.current_derivative = sum([circuit.current_derivative for circuit in member_circuits])

    elseif typeof(element) == Capacitor
        element.current_integral += sum([circuit.current * dt for circuit in member_circuits])

    end
end

bat1 = Battery(10, [], [])
res1 = Resistor(1, 0, [], [])
ind1 = Inductor(1, 0, [], [])
cap1 = Capacitor(0.01, 0, [], [])

objects = [bat1, res1, cap1, ind1]

bat1.links = [res1]
res1.links = [cap1]
cap1.links = [ind1]
ind1.links = [bat1]

circuits = find_circuits(objects)
for circuit in circuits
    print_loop(circuit.elements)
end
println("----- # of circuits -----")
println(length(circuits))

times = [0.0]
currents = [0.0]
for t in dt:dt:(dt*1000)
    previous_currents = [circuit.current for circuit in circuits]
    previous_integrals = [circuit.current_integral for circuit in circuits]

    # Recalculate current five times for accuracy
    for n in 1:5
        for (i, circuit) in enumerate(circuits)        
            current = step_sim(circuit)

            circuit.current = current
            circuit.current_derivative = (current - previous_currents[i]) / dt
            circuit.current_integral = previous_integrals[i] + ( current * dt )
            circuit.elapsed_time = circuits[i].elapsed_time + dt
        end
    end


    for object in objects
        step_object(object)
    end

    push!(times, t)
    push!(currents, res1.current)
end

plot(times, currents)