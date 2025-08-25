using GLMakie

function plot(times, currents)
    fig = Figure()
    ax = Axis(fig[1, 1])

    lines!(ax, times, currents, color=:black)

    display(fig)
end