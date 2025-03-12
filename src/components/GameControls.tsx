
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { PauseIcon, PlayIcon, Save, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const GameControls: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleTogglePause = () => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  };
  
  const handleSaveGame = () => {
    dispatch({ type: 'SAVE_GAME' });
  };
  
  const handleResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <div className="flex items-center space-x-2 animate-fade-in-right">
      <Button 
        variant="outline" 
        size="icon"
        className="glass-panel border-white/10"
        onClick={handleTogglePause}
      >
        {state.paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        className="glass-panel border-white/10"
        onClick={handleSaveGame}
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="glass-panel border-white/10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="glass-panel border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will erase all your progress and start a new game. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="button-secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="button-primary bg-red-900/20 border-red-500/30 hover:bg-red-900/40"
              onClick={handleResetGame}
            >
              Reset Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
