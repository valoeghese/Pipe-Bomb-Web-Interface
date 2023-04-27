import { Button, Grid, Popover, Text } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { MdQueueMusic, MdRepeat, MdRepeatOne, MdOutlineDeleteOutline } from "react-icons/md";
import { ReactSortable } from "react-sortablejs";
import AudioPlayer from "../logic/AudioPlayer";
import styles from "../styles/Queue.module.scss";
import QueueTrack from "./QueueTrack";
import { IoMdShuffle } from "react-icons/io";

interface ItemInterface {
    id: number
}

interface QueueProps {
    sideBar?: boolean
}

export default function Queue({ sideBar }: QueueProps) {
    const audioPlayer = AudioPlayer.getInstance();
    const [trackList, setTrackList] = useState(audioPlayer.getQueue());
    const [history, setHistory] = useState(audioPlayer.getHistory());
    const currentTrack = useRef<HTMLDivElement>(null);

    const queueCallback = () => {
        setTrackList(audioPlayer.getQueue());
        setHistory(audioPlayer.getHistory());
        setTimeout(() => {
            if (currentTrack.current) {
                const offset = currentTrack.current.offsetTop;
                const scroll = currentTrack.current.parentElement.scrollTop;
                if (Math.abs(offset - scroll - 200) < currentTrack.current.parentElement.parentElement.clientHeight / 2) {
                    currentTrack.current.parentElement.scrollTo({
                        top: offset - 200,
                        behavior: "smooth"
                    });
                }
            }
        }, 50);
    }

    useEffect(() => {
        audioPlayer.registerQueueCallback(queueCallback);

        return () => {
            audioPlayer.unregisterQueueCallback(queueCallback);
        }
    }, []);




    const itemList: ItemInterface[] = [];
    for (let i = 0; i < trackList.length; i++) {
        itemList.push({
            id: i
        });
    }

    function reArrangeQueue(event: ItemInterface[]) {
        let different = false;
        for (let i = 0; i < event.length; i++) {
            if (itemList[i].id != event[i].id) {
                different = true;
                break;
            }
        }
        if (!different) return;
        audioPlayer.setQueueOrder(event.map(item => item.id));
    }

    const track = audioPlayer.getCurrentTrack();

    if (sideBar) {
        return (
            <div className={styles.container}>
                <Grid.Container className={styles.topButtons} gap={1}>
                    <Grid>
                        <Button className={styles.roundButton} auto light={!audioPlayer.isShuffled()} onPress={() => audioPlayer.setShuffled(!audioPlayer.isShuffled())}><IoMdShuffle /></Button>
                    </Grid>
                    <Grid>
                        <Button className={styles.roundButton} auto light={audioPlayer.getLoopStatus() == "none"} onPress={() => audioPlayer.cycleLoopStatus()}>
                            {audioPlayer.getLoopStatus() == "one" ? (
                                <MdRepeatOne />
                            ) : (
                                <MdRepeat />
                            )}
                        </Button>
                    </Grid>
                    <Grid>
                        <Button className={styles.roundButton} auto light onPress={() => audioPlayer.clearQueue()} disabled={!audioPlayer.getQueue().length}><MdOutlineDeleteOutline /></Button>
                    </Grid>
                </Grid.Container>
                <div className={styles.scroll}>
                    {history.length ? (
                        <Text h3 className={styles.queueTitle}>History</Text>
                    ) : null}
                    
                    <div>
                        {history.map(track => (
                            <QueueTrack key={track.queueID} track={track} index={-2} />
                        ))}
                    </div>

                    {track ? (
                        <div ref={currentTrack}>
                            <Text h3 className={styles.queueTitle}>Now Playing</Text>
                            <QueueTrack key={track.queueID} track={track} index={-1} />
                        </div>
                    ) : null}
                    
                    <Text h3 className={styles.queueTitle}>Queue</Text>
                    <ReactSortable list={itemList} setList={event => reArrangeQueue(event)} animation={100}>
                        {trackList.map((track, index) => (
                            <QueueTrack key={track.queueID} track={track} index={index} />
                        ))}
                    </ReactSortable>
                </div>
            </div>
        )
    }

    function popoverOpen(open: boolean) {
        if (!open) return;
        
        setTimeout(() => {
            if (currentTrack.current) {
                const offset = currentTrack.current.offsetTop;
                currentTrack.current.parentElement.scrollTo({
                    top: offset - 200,
                    behavior: "smooth"
                });
            }
        }, 50);
    }


    return (
        <Popover placement={"top-right"} onOpenChange={popoverOpen}>
            <Popover.Trigger>
                <Button auto light rounded className={styles.roundButton + " " + styles.queueButton}><MdQueueMusic /></Button>
            </Popover.Trigger>
            <Popover.Content className={styles.queuePopover}>
                <div className={styles.container + " " + styles.queue}>
                    <Grid.Container className={styles.topButtons} gap={1}>
                        <Grid>
                            <Button className={styles.roundButton} auto light={!audioPlayer.isShuffled()} onPress={() => audioPlayer.setShuffled(!audioPlayer.isShuffled())}><IoMdShuffle /></Button>
                        </Grid>
                        <Grid>
                            <Button className={styles.roundButton} auto light={audioPlayer.getLoopStatus() == "none"} onPress={() => audioPlayer.cycleLoopStatus()}>
                                {audioPlayer.getLoopStatus() == "one" ? (
                                    <MdRepeatOne />
                                ) : (
                                    <MdRepeat />
                                )}
                            </Button>
                        </Grid>
                        <Grid>
                            <Button className={styles.roundButton} auto light onPress={() => audioPlayer.clearQueue()} disabled={!audioPlayer.getQueue().length}><MdOutlineDeleteOutline /></Button>
                        </Grid>
                    </Grid.Container>
                    <div className={styles.scroll}>
                        {history.length ? (
                            <Text h3 className={styles.queueTitle}>History</Text>
                        ) : null}
                        
                        <div>
                            {history.map(track => (
                                <QueueTrack key={track.queueID} track={track} index={-2} />
                            ))}
                        </div>

                        {track ? (
                            <div ref={currentTrack}>
                                <Text h3 className={styles.queueTitle}>Now Playing</Text>
                                <QueueTrack key={track.queueID} track={track} index={-1} />
                            </div>
                        ) : null}
                        
                        <Text h3 className={styles.queueTitle}>Queue</Text>
                        <ReactSortable list={itemList} setList={event => reArrangeQueue(event)} animation={100}>
                            {trackList.map((track, index) => (
                                <QueueTrack key={track.queueID} track={track} index={index} />
                            ))}
                        </ReactSortable>
                    </div>
                </div>
            </Popover.Content>
        </Popover>
    )
}