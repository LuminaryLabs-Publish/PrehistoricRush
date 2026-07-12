# Run Start Audit: Run Epoch, Reset and First-Frame Contract

**Generated:** `2026-07-12T09-01-44-04-00`

## Required transaction

```txt
RunStartCommand
  -> predecessor admission
  -> allocate run epoch
  -> prepare run/input state
  -> prepare simulation resolution
  -> prepare physics body/contact state
  -> prepare stream/Worker adoption or reset
  -> prepare active content and collider state
  -> prepare camera and scene transition
  -> validate participant receipts
  -> atomic commit or rollback
  -> admit first tick
  -> acknowledge first visible frame
```

## Required participant evidence

```txt
run resource revision
input revision
simulation resolution generation
physics body/frame generation
stream/controller generation
Worker request generation
active-content/collider revision
camera reset revision
scene transition revision
first committed tick revision
first visible frame ID
```

## Required lifecycle rules

```txt
initial boot and retry share one path
old asynchronous results cannot attach to the new epoch
no participant commits twice
rollback retires candidate resources
input remains suspended until commit
terminal predecessor remains observable until new run commit
```
