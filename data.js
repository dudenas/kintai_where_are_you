const _data = []

class DataObj {
    constructor(path, clr, idx) {
        this.data = []
        this.loadData(path)
        this.clr = clr
        this.idx = idx
        this.current = 0
    }

    show(angleX) {

        noFill()
        stroke(this.clr)
        this.showPath()

        noStroke()
        fill(this.clr)
        this.showDots()
        // fill(_clrs[1])
        // this.showText(angleX)

        if (frameCount % 100 == 0) this.current = (this.current + 1) % this.data.length
    }

    showPath() {
        const z = this.idx * _zdiff
        for (let i = 0; i < this.data.length; i++) {
            const track = this.data[i].coordinates
            if (typeof track[0] != "number") {
                beginShape()
                for (let j = 0; j < track.length; j++) {
                    const point = track[j]
                    const x = mercX(point[0]) - _cx
                    const y = mercY(point[1]) - _cy
                    vertex(x, y, z)
                }
                endShape()
            } else {
                beginShape()
                const x = mercX(track[0]) - _cx
                const y = mercY(track[1]) - _cy
                vertex(x, y, z)
                endShape()
            }
        }
    }

    showDots() {
        const z = this.idx * _zdiff
        for (let i = 0; i < this.data.length; i++) {
            const track = this.data[i].coordinates
            if (typeof track[0] != "number") {
                for (let j = 0; j < track.length; j++) {
                    const point = track[j]
                    const x = mercX(point[0]) - _cx
                    const y = mercY(point[1]) - _cy
                    // ellipse(x, y, _r, _r)
                    push()
                    translate(x, y, z)
                    sphere(sqrt(_r))
                    pop()
                }
            } else {
                const x = mercX(track[0]) - _cx
                const y = mercY(track[1]) - _cy
                push()
                translate(x, y, z)
                sphere(sqrt(_r))
                pop()
            }
        }
    }

    showText(angleX) {
        const z = this.idx * _zdiff
        // for (let i = 0; i < this.data.length; i++) {
        // const track = this.data[i].coordinates
        const track = this.data[this.current].coordinates
        const xoff = 50 + this.current * 20
        if (typeof track[0] != "number") {
            let lastDistance = 0
            for (let j = 0; j < track.length; j++) {
                const point = track[j]
                const x = mercX(point[0]) - _cx
                const y = mercY(point[1]) - _cy
                // if (j > 0) {
                // lastDistance = dist(x, y, track[j - 1][0], track[j - 1][1])
                // console.log(lastDistance)
                // noLoop()
                // }
                // if (lastDistance > 100) {
                stroke(_clrs[1])
                noFill()
                beginShape()
                vertex(x, y, z)
                vertex(x + xoff, y, z)
                endShape()
                noStroke()
                fill(_clrs[1])
                push()
                translate(x + xoff, y, z)
                rotateX(angleX)
                text(this.current, 0, 0)
                pop()
                // }
            }
        } else {
            const x = mercX(track[0]) - _cx
            const y = mercY(track[1]) - _cy
            stroke(_clrs[1])
            noFill()
            beginShape()
            vertex(x, y, z)
            vertex(x + xoff, y, z)
            endShape()
            noStroke()
            fill(_clrs[1])
            push()
            translate(x + xoff, y, z)
            rotateX(angleX)
            text(this.current, 0, 0)
            pop()
        }
        // }
    }

    //————————————————————————————————————————————— loadData
    loadData(path) {
        loadJSON(path, (out) => {
            const data = out.features
            for (let i = 0; i < data.length; i++) {
                const point = data[i]
                const coordinates = point.geometry.coordinates
                const description = point.properties.description

                // FROM
                const fromString = (/\bfrom \b([0-9-:T]+)/).exec(description)[1]
                let from = splitData(fromString)

                const toString = (/\bto \b(.*)\./).exec(description)[1]
                let to = splitData(toString)

                const timeTaken = from
                // console.log(timeTaken)
                const diffFrom = new Date(from.year, from.month, from.day, from.hour, from.minute, from.second)
                const diffTo = new Date(to.year, to.month, to.day, to.hour, to.minute, to.second)
                const diff = timeUnitsBetween(diffFrom, diffTo)
                const diffTime = diff.days * 24 * 60 * 60 + diff.hours * 60 * 60 + diff.minutes * 60 + diff.seconds

                const distance = int((/\bDistance \b(.*)\m/).exec(description)[1])
                const obj = {
                    from,
                    to,
                    distance,
                    diffTime,
                    coordinates
                }
                this.data.push(obj)
            }
        })
    }
}

function loadData() {
    // KOSMIS
    loadDir('./data/Kosmis/', 'kosmis_data', _clrs[2])
    // MARTIS
    // loadDir('./data/Martis/', _clrs[3])

}

function loadDir(dir, filename, clr) {
    loadStrings(filename + '.txt', (data) => {
        for (var i = 0; i < data.length; i++) {
            const path = dir + data[i]
            console.log(path)
            const obj = new DataObj(path, clr, i)
            _data.push(obj)
        }
    })
    // $.getJSON(dir, function (data) {
    //     for (var i = 0; i < data.length; i++) {
    //         const path = dir + data[i]
    //         const obj = new DataObj(path, clr, i)
    //         _data.push(obj)
    //     }
    // })
}

//————————————————————————————————————————————— Helping functions
function mercX(lon) {
    lon = radians(lon)
    const a = (256 / PI) * pow(2, _zoom)
    const b = lon + PI
    return a * b
}

function mercY(lat) {
    lat = radians(lat)
    const a = (256 / PI) * pow(2, _zoom)
    const b = tan(PI / 4 + lat / 2)
    const c = PI - log(b)
    return a * c
}

//————————————————————————————————————————————— timeUnitsBetween
function timeUnitsBetween(startDate, endDate) {
    let delta = Math.abs(endDate - startDate) / 1000;
    const isNegative = startDate > endDate ? -1 : 1;
    return [
        ['days', 24 * 60 * 60],
        ['hours', 60 * 60],
        ['minutes', 60],
        ['seconds', 1]
    ].reduce((acc, [key, value]) => (acc[key] = Math.floor(delta / value) * isNegative, delta -= acc[key] * isNegative * value, acc), {});
}

//————————————————————————————————————————————— splitData
function splitData(data) {
    // DATE
    let date = (/[\d-]+/).exec(data)[0]
    date = split(date, '-')
    const year = int(date[0])
    const month = int(date[1])
    const day = int(date[2])
    // TIME
    let time = (/\T([\d:]+)/).exec(data)[1]
    time = split(time, ':')
    const hour = int(time[0])
    const minute = int(time[1])
    const second = int(time[2])
    return {
        year,
        month,
        day,
        hour,
        minute,
        second
    }
}