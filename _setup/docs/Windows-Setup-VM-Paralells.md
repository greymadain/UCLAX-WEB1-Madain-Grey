# System Setup: Uclax Web 1: Windows - Mitch Setting Up Windows on M1 Chip with Parallells

[Back to Main](../SETUP.md)

This is my setup for Emulating Windows 11 on my Mac so I can demo setup in video.

## Downgrade to WSL 1

After installing WSL, we need to downgrade to WSL 1 because of M1 chip limitations

https://kb.parallels.com/129234

```bash
wsl --set-default-version 1
```
