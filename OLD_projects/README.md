## Project Structure

├────── common ──────────────────── Root of system wide data
│   ├── models ──────────────────── Frozen model files
│   ├── flows ───────────────────── Node-Red flow definitions
│   └── stl ─────────────────────── Part geometry files
└────── projects ────────────────── Root of all projects
    └────── Project Name ────────── Root of Project definition
        ├───── calibrations ─────── Calibration files if required
        ├───── code ─────────────── Project specific code if required
        ├───── config ───────────── Project.conf and 
        │                           Config files of active plugins
        ├───── images
        │   └───── date
        │       └───── Part Name ── Image files (last n-days)
        ├───── logs ─────────────── Log files (last n-days)
        ├───── parts ────────────── Part files with regions of
        │                           interest, measurement and
        │                           inspection character definitions
        └───── stats ────────────── Orders.json in the root
            └───── date
                └───── Part Name ── Statistic files (last n-days)
